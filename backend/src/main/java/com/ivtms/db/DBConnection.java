package com.ivtms.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // MySQL Settings
    private static final String URL      = "jdbc:mysql://localhost:3306/ivtms_db?useSSL=false";
    private static final String USER     = System.getenv("DB_USERNAME") != null ? System.getenv("DB_USERNAME") : "your_db_user";
    private static final String PASSWORD = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "your_db_password"; 

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC Driver not found", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
