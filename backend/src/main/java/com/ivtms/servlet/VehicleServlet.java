package com.ivtms.servlet;

import com.ivtms.dao.VehicleDAO;
import com.ivtms.model.Vehicle;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

/**
 * Endpoints:
 *   GET  /api/vehicles?rc=MH-12-AB-1234        -> lookup single vehicle by RC
 *   GET  /api/vehicles?userId=1                 -> all vehicles linked to a user
 *   GET  /api/vehicles                          -> all vehicles (RTO/admin)
 *   POST /api/vehicles/link  body: userId=1&rc=MH-12-AB-1234&chassis=AB1234  -> link vehicle to user
 */
@WebServlet("/api/vehicles/*")
public class VehicleServlet extends HttpServlet {

    private final VehicleDAO dao = new VehicleDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();

        try {
            String rc     = req.getParameter("rc");
            String userId = req.getParameter("userId");

            if (rc != null && !rc.isEmpty()) {
                Vehicle v = dao.findByRcNumber(rc.trim().toUpperCase());
                if (v != null) {
                    out.print(toJson(v));
                } else {
                    resp.setStatus(404);
                    out.print("{\"error\":\"Vehicle not found\"}");
                }
            } else if (userId != null) {
                List<Vehicle> list = dao.findByUserId(Integer.parseInt(userId));
                out.print(toJsonArray(list));
            } else {
                List<Vehicle> list = dao.findAll();
                out.print(toJsonArray(list));
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

        String pathInfo = req.getPathInfo(); // "/link"
        if ("/link".equals(pathInfo)) {
            String userIdStr = req.getParameter("userId");
            String rc        = req.getParameter("rc");
            String chassis   = req.getParameter("chassis");

            if (userIdStr == null || rc == null || chassis == null) {
                resp.setStatus(400);
                out.print("{\"error\":\"userId, rc and chassis are required\"}");
                return;
            }

            try {
                Vehicle v = dao.findByRcNumber(rc.trim().toUpperCase());
                if (v == null) {
                    resp.setStatus(404);
                    out.print("{\"error\":\"Vehicle not found\"}");
                    return;
                }
                // Verify chassis (last 6 chars, case-insensitive)
                if (!v.getChassisNumber().toUpperCase().endsWith(chassis.trim().toUpperCase())) {
                    resp.setStatus(400);
                    out.print("{\"error\":\"Chassis number does not match\"}");
                    return;
                }
                boolean linked = dao.linkVehicleToUser(Integer.parseInt(userIdStr), v.getId());
                if (linked) {
                    out.print("{\"success\":true,\"vehicle\":" + toJson(v) + "}");
                } else {
                    out.print("{\"success\":false,\"message\":\"Vehicle already linked to your account\"}");
                }
            } catch (SQLException e) {
                resp.setStatus(500);
                out.print("{\"error\":\"" + e.getMessage() + "\"}");
            }
        } else {
            resp.setStatus(404);
            out.print("{\"error\":\"Unknown endpoint\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(200);
    }

    // --- JSON helpers (no external library needed) ---
    private String toJson(Vehicle v) {
        return "{" +
            "\"id\":"              + v.getId()                          + "," +
            "\"rcNumber\":\""      + esc(v.getRcNumber())               + "\"," +
            "\"ownerName\":\""     + esc(v.getOwnerName())              + "\"," +
            "\"vehicleName\":\""   + esc(v.getVehicleName())            + "\"," +
            "\"vehicleType\":\""   + esc(v.getVehicleType())            + "\"," +
            "\"registrationDate\":\"" + esc(v.getRegistrationDate())    + "\"," +
            "\"status\":\""        + esc(v.getStatus())                 + "\"," +
            "\"insuranceStatus\":\"" + esc(v.getInsuranceStatus())      + "\"," +
            "\"pucStatus\":\""     + esc(v.getPucStatus())              + "\"," +
            "\"taxStatus\":\""     + esc(v.getTaxStatus())              + "\"" +
        "}";
    }

    private String toJsonArray(List<Vehicle> list) {
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
