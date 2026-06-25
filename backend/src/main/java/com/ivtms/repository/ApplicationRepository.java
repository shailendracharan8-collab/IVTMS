package com.ivtms.repository;

import com.ivtms.entity.Application;
import com.ivtms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByAppId(String appId);
    List<Application> findByStatus(String status);
    List<Application> findByStatusIn(List<String> statuses);
    List<Application> findByUser(User user);
    long countByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM Application a WHERE a.identityProofUrl = :url OR a.addressProofUrl = :url OR a.vehicleInvoiceUrl = :url OR a.existingRcUrl = :url OR a.insuranceDocUrl = :url OR a.pucDocUrl = :url OR a.vehicleImageUrl = :url")
    Optional<Application> findByAnyDocumentUrl(@org.springframework.data.repository.query.Param("url") String url);
}
