package com.ivtms.model;

public class FraudCase {
    private int id;
    private String vehicleNo;
    private String flagType;    // Stolen Vehicle, Fake Insurance, Duplicate RC, Other
    private String reportedBy;
    private String reportedDate;
    private String severity;    // High, Medium, Low
    private String status;      // Open, Escalated, Resolved, Blacklisted
    private String remarks;

    public FraudCase() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }

    public String getFlagType() { return flagType; }
    public void setFlagType(String flagType) { this.flagType = flagType; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public String getReportedDate() { return reportedDate; }
    public void setReportedDate(String reportedDate) { this.reportedDate = reportedDate; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
