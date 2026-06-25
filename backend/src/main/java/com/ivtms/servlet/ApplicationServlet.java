package com.ivtms.servlet;

import com.ivtms.dao.ApplicationDAO;
import com.ivtms.model.Application;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

/**
 * Endpoints:
 *   GET  /api/applications              -> all applications
 *   GET  /api/applications?status=Pending
 *   GET  /api/applications?appId=APP-8942
 *   POST /api/applications/approve  body: appId=APP-8942
 *   POST /api/applications/reject   body: appId=APP-8942
 */
@WebServlet("/api/legacy/applications/*")
public class ApplicationServlet extends HttpServlet {

    private final ApplicationDAO dao = new ApplicationDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();

        try {
            String appId  = req.getParameter("appId");
            String status = req.getParameter("status");

            if (appId != null) {
                Application a = dao.findByAppId(appId);
                out.print(a != null ? toJson(a) : "{\"error\":\"Not found\"}");
            } else if (status != null) {
                out.print(toJsonArray(dao.findByStatus(status)));
            } else {
                out.print(toJsonArray(dao.findAll()));
            }
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

        String pathInfo = req.getPathInfo(); // "/approve" or "/reject"
        String appId    = req.getParameter("appId");

        if (appId == null || appId.isEmpty()) {
            resp.setStatus(400);
            out.print("{\"error\":\"appId is required\"}");
            return;
        }

        try {
            String newStatus = "/approve".equals(pathInfo) ? "Approved" : "Rejected";
            boolean updated  = dao.updateStatus(appId, newStatus);
            if (updated) {
                out.print("{\"success\":true,\"status\":\"" + newStatus + "\"}");
            } else {
                resp.setStatus(404);
                out.print("{\"error\":\"Application not found\"}");
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

    private String toJson(Application a) {
        return "{" +
            "\"id\":"               + a.getId()                       + "," +
            "\"appId\":\""          + esc(a.getAppId())               + "\"," +
            "\"applicantName\":\""  + esc(a.getApplicantName())       + "\"," +
            "\"type\":\""           + esc(a.getType())                + "\"," +
            "\"submittedAt\":\""    + esc(a.getSubmittedAt())         + "\"," +
            "\"status\":\""         + esc(a.getStatus())              + "\"," +
            "\"rtoOffice\":\""      + esc(a.getRtoOffice())           + "\"" +
        "}";
    }

    private String toJsonArray(List<Application> list) {
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
