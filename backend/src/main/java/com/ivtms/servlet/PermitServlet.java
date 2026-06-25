package com.ivtms.servlet;

import com.ivtms.dao.PermitDAO;
import com.ivtms.model.Permit;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

/**
 * Endpoints:
 *   GET  /api/permits                  -> all permits
 *   POST /api/permits/issue  body: vehicleNo=...&ownerName=...&permitType=...&validUntil=...
 *   POST /api/permits/renew  body: permitNo=PRM-2024-001&validUntil=2027-04-30
 */
@WebServlet("/api/permits/*")
public class PermitServlet extends HttpServlet {

    private final PermitDAO dao = new PermitDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();
        try {
            out.print(toJsonArray(dao.findAll()));
        } catch (SQLException e) {
            resp.setStatus(500);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();
        String pathInfo = req.getPathInfo();

        try {
            if ("/issue".equals(pathInfo)) {
                Permit p = new Permit();
                p.setPermitNo("PRM-" + System.currentTimeMillis());
                p.setVehicleNo(req.getParameter("vehicleNo"));
                p.setOwnerName(req.getParameter("ownerName"));
                p.setPermitType(req.getParameter("permitType"));
                p.setIssuedDate(java.time.LocalDate.now().toString());
                p.setValidUntil(req.getParameter("validUntil"));
                p.setIssuedBy("Pune RTO");
                boolean ok = dao.insert(p);
                out.print("{\"success\":" + ok + ",\"permitNo\":\"" + p.getPermitNo() + "\"}");

            } else if ("/renew".equals(pathInfo)) {
                String permitNo    = req.getParameter("permitNo");
                String validUntil  = req.getParameter("validUntil");
                if (permitNo == null || validUntil == null) {
                    resp.setStatus(400);
                    out.print("{\"error\":\"permitNo and validUntil are required\"}");
                    return;
                }
                boolean ok = dao.renew(permitNo, validUntil);
                out.print("{\"success\":" + ok + "}");

            } else {
                resp.setStatus(404);
                out.print("{\"error\":\"Unknown endpoint\"}");
            }
        } catch (SQLException e) {
            resp.setStatus(500);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(200);
    }

    private String toJson(Permit p) {
        return "{" +
            "\"id\":"            + p.getId()                     + "," +
            "\"permitNo\":\""    + esc(p.getPermitNo())          + "\"," +
            "\"vehicleNo\":\""   + esc(p.getVehicleNo())         + "\"," +
            "\"ownerName\":\""   + esc(p.getOwnerName())         + "\"," +
            "\"permitType\":\""  + esc(p.getPermitType())        + "\"," +
            "\"issuedDate\":\""  + esc(p.getIssuedDate())        + "\"," +
            "\"validUntil\":\""  + esc(p.getValidUntil())        + "\"," +
            "\"issuedBy\":\""    + esc(p.getIssuedBy())          + "\"," +
            "\"status\":\""      + esc(p.getStatus())            + "\"" +
        "}";
    }

    private String toJsonArray(List<Permit> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append(toJson(list.get(i)));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    private String esc(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
