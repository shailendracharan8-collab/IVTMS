package com.ivtms.dao;

import com.ivtms.db.DBConnection;
import com.ivtms.model.FraudCase;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FraudDAO {

    public List<FraudCase> findAll() throws SQLException {
        String sql = "SELECT * FROM fraud_cases ORDER BY id DESC";
        List<FraudCase> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        }
        return list;
    }

    public boolean updateStatus(int id, String status, String remarks) throws SQLException {
        String sql = "UPDATE fraud_cases SET status = ?, remarks = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, remarks);
            ps.setInt(3, id);
            return ps.executeUpdate() > 0;
        }
    }

    private FraudCase mapRow(ResultSet rs) throws SQLException {
        FraudCase f = new FraudCase();
        f.setId(rs.getInt("id"));
        f.setVehicleNo(rs.getString("vehicle_no"));
        f.setFlagType(rs.getString("flag_type"));
        f.setReportedBy(rs.getString("reported_by"));
        f.setReportedDate(rs.getString("reported_date"));
        f.setSeverity(rs.getString("severity"));
        f.setStatus(rs.getString("status"));
        f.setRemarks(rs.getString("remarks"));
        return f;
    }
}
