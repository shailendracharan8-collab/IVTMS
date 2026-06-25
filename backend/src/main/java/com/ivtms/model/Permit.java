package com.ivtms.model;

public class Permit {
    private int id;
    private String permitNo;
    private String vehicleNo;
    private String ownerName;
    private String permitType;  // National Permit, State Permit, Tourist Permit
    private String issuedDate;
    private String validUntil;
    private String issuedBy;
    private String status;      // Active, Expiring Soon, Expired

    public Permit() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPermitNo() { return permitNo; }
    public void setPermitNo(String permitNo) { this.permitNo = permitNo; }

    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getPermitType() { return permitType; }
    public void setPermitType(String permitType) { this.permitType = permitType; }

    public String getIssuedDate() { return issuedDate; }
    public void setIssuedDate(String issuedDate) { this.issuedDate = issuedDate; }

    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }

    public String getIssuedBy() { return issuedBy; }
    public void setIssuedBy(String issuedBy) { this.issuedBy = issuedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
