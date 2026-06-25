package com.ivtms.dao;

import com.ivtms.db.DBConnection;
import com.ivtms.model.Vehicle;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VehicleDAO {

    // Fetch a single vehicle by RC number (used for RC lookup / link vehicle)
    public Vehicle findByRcNumber(String rcNumber) throws SQLException {
        String sql = "SELECT * FROM vehicles WHERE rc_number = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, rcNumber);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        }
        return null;
    }

    // Fetch all vehicles linked to a citizen user
    public List<Vehicle> findByUserId(int userId) throws SQLException {
        String sql = "SELECT v.* FROM vehicles v " +
                     "JOIN user_vehicles uv ON v.id = uv.vehicle_id " +
                     "WHERE uv.user_id = ?";
        List<Vehicle> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) list.add(mapRow(rs));
            }
        }
        return list;
    }

    // Fetch all vehicles (RTO officer / admin view)
    public List<Vehicle> findAll() throws SQLException {
        String sql = "SELECT * FROM vehicles ORDER BY id DESC";
        List<Vehicle> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        }
        return list;
    }

    // Link a vehicle to a citizen user account
    public boolean linkVehicleToUser(int userId, int vehicleId) throws SQLException {
        // Check if already linked
        String check = "SELECT id FROM user_vehicles WHERE user_id = ? AND vehicle_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(check)) {
            ps.setInt(1, userId);
            ps.setInt(2, vehicleId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return false; // already linked
            }
        }
        String sql = "INSERT INTO user_vehicles (user_id, vehicle_id) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, vehicleId);
            return ps.executeUpdate() > 0;
        }
    }

    // Update vehicle status
    public boolean updateStatus(String rcNumber, String status) throws SQLException {
        String sql = "UPDATE vehicles SET status = ? WHERE rc_number = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setString(2, rcNumber);
            return ps.executeUpdate() > 0;
        }
    }

    private Vehicle mapRow(ResultSet rs) throws SQLException {
        Vehicle v = new Vehicle();
        v.setId(rs.getInt("id"));
        v.setRcNumber(rs.getString("rc_number"));
        v.setOwnerName(rs.getString("owner_name"));
        v.setVehicleName(rs.getString("vehicle_name"));
        v.setVehicleType(rs.getString("vehicle_type"));
        v.setChassisNumber(rs.getString("chassis_number"));
        v.setRegistrationDate(rs.getString("registration_date"));
        v.setStatus(rs.getString("status"));
        v.setInsuranceStatus(rs.getString("insurance_status"));
        v.setPucStatus(rs.getString("puc_status"));
        v.setTaxStatus(rs.getString("tax_status"));
        return v;
    }
}
