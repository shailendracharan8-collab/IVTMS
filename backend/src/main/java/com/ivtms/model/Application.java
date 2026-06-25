package com.ivtms.model;

public class Application {
    private int id;
    private String appId;
    private String applicantName;
    private String type;        // New Registration, Ownership Transfer, RC Renewal, Commercial Permit
    private String submittedAt;
    private String status;      // Pending, Approved, Rejected
    private String rtoOffice;

    public Application() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getAppId() { return appId; }
    public void setAppId(String appId) { this.appId = appId; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRtoOffice() { return rtoOffice; }
    public void setRtoOffice(String rtoOffice) { this.rtoOffice = rtoOffice; }
}
