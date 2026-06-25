package com.ivtms.dao;

import com.ivtms.db.DBConnection;
import com.ivtms.model.Application;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ApplicationDAO {

    public List<Application> findAll() throws SQLException {
        String sql = "SELECT * FROM applications ORDER BY id DESC";
        List<Application> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        }
        return list;
    }

    public List<Application> findByStatus(String status) throws SQLException {
        String sql = "SELECT * FROM applications WHERE status = ? ORDER BY id DESC";
        List<Application> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) list.add(mapRow(rs));
            }
        }
        return list;
    }

    public Application findByAppId(String appId) throws SQLException {
        String sql = "SELECT * FROM applications WHERE app_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, appId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        }
        return null;
    }

    // Update status: Approved / Rejected
    public boolean updateStatus(String appId, String status) throws SQLException {
        String sql = "UPDATE applications SET status = ? WHERE app_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, appId);
            return ps.executeUpdate() > 0;
        }
    }

    private Application mapRow(ResultSet rs) throws SQLException {
        Application a = new Application();
        a.setId(rs.getInt("id"));
        a.setAppId(rs.getString("app_id"));
        a.setApplicantName(rs.getString("applicant_name"));
        a.setType(rs.getString("type"));
        a.setSubmittedAt(rs.getString("submitted_at"));
        a.setStatus(rs.getString("status"));
        a.setRtoOffice(rs.getString("rto_office"));
        return a;
    }
}
