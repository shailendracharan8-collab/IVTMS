package com.ivtms.dao;

import com.ivtms.db.DBConnection;
import com.ivtms.model.Permit;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PermitDAO {

    public List<Permit> findAll() throws SQLException {
        String sql = "SELECT * FROM permits ORDER BY id DESC";
        List<Permit> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        }
        return list;
    }

    public boolean insert(Permit p) throws SQLException {
        String sql = "INSERT INTO permits (permit_no, vehicle_no, owner_name, permit_type, issued_date, valid_until, issued_by, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, p.getPermitNo());
            ps.setString(2, p.getVehicleNo());
            ps.setString(3, p.getOwnerName());
            ps.setString(4, p.getPermitType());
            ps.setString(5, p.getIssuedDate());
            ps.setString(6, p.getValidUntil());
            ps.setString(7, p.getIssuedBy());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean renew(String permitNo, String newValidUntil) throws SQLException {
        String sql = "UPDATE permits SET valid_until = ?, status = 'Active' WHERE permit_no = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newValidUntil);
            ps.setString(2, permitNo);
            return ps.executeUpdate() > 0;
        }
    }

    private Permit mapRow(ResultSet rs) throws SQLException {
        Permit p = new Permit();
        p.setId(rs.getInt("id"));
        p.setPermitNo(rs.getString("permit_no"));
        p.setVehicleNo(rs.getString("vehicle_no"));
        p.setOwnerName(rs.getString("owner_name"));
        p.setPermitType(rs.getString("permit_type"));
        p.setIssuedDate(rs.getString("issued_date"));
        p.setValidUntil(rs.getString("valid_until"));
        p.setIssuedBy(rs.getString("issued_by"));
        p.setStatus(rs.getString("status"));
        return p;
    }
}
