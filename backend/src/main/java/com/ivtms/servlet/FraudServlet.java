package com.ivtms.servlet;

import com.ivtms.dao.FraudDAO;
import com.ivtms.model.FraudCase;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

/**
 * Endpoints:
 *   GET  /api/fraud                -> all fraud cases
 *   POST /api/fraud/update  body: id=1&status=Escalated&remarks=...
 */
@WebServlet("/api/fraud/*")
public class FraudServlet extends HttpServlet {

    private final FraudDAO dao = new FraudDAO();

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

        String idStr   = req.getParameter("id");
        String status  = req.getParameter("status");
        String remarks = req.getParameter("remarks");

        if (idStr == null || status == null) {
            resp.setStatus(400);
            out.print("{\"error\":\"id and status are required\"}");
            return;
        }
        try {
            boolean updated = dao.updateStatus(Integer.parseInt(idStr), status, remarks);
            out.print("{\"success\":" + updated + "}");
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

    private String toJson(FraudCase f) {
        return "{" +
            "\"id\":"             + f.getId()                      + "," +
            "\"vehicleNo\":\""    + esc(f.getVehicleNo())          + "\"," +
            "\"flagType\":\""     + esc(f.getFlagType())           + "\"," +
            "\"reportedBy\":\""   + esc(f.getReportedBy())         + "\"," +
            "\"reportedDate\":\"" + esc(f.getReportedDate())       + "\"," +
            "\"severity\":\""     + esc(f.getSeverity())           + "\"," +
            "\"status\":\""       + esc(f.getStatus())             + "\"," +
            "\"remarks\":\""      + esc(f.getRemarks())            + "\"" +
        "}";
    }

    private String toJsonArray(List<FraudCase> list) {
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
