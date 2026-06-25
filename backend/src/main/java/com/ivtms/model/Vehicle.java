package com.ivtms.model;

public class Vehicle {
    private int id;
    private String rcNumber;
    private String ownerName;
    private String vehicleName;
    private String vehicleType;
    private String chassisNumber;
    private String registrationDate;
    private String status;          // Active, Expired, Flagged
    private String insuranceStatus; // Valid, Expired
    private String pucStatus;       // Valid, Expiring, Expired
    private String taxStatus;       // Paid, Due

    public Vehicle() {}

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRcNumber() { return rcNumber; }
    public void setRcNumber(String rcNumber) { this.rcNumber = rcNumber; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getChassisNumber() { return chassisNumber; }
    public void setChassisNumber(String chassisNumber) { this.chassisNumber = chassisNumber; }

    public String getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInsuranceStatus() { return insuranceStatus; }
    public void setInsuranceStatus(String insuranceStatus) { this.insuranceStatus = insuranceStatus; }

    public String getPucStatus() { return pucStatus; }
    public void setPucStatus(String pucStatus) { this.pucStatus = pucStatus; }

    public String getTaxStatus() { return taxStatus; }
    public void setTaxStatus(String taxStatus) { this.taxStatus = taxStatus; }
}
