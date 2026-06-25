package com.ivtms.controller;

import com.ivtms.entity.Application;
import com.ivtms.entity.User;
import com.ivtms.repository.ApplicationRepository;
import com.ivtms.repository.UserRepository;
import com.ivtms.service.FileStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationRepository applicationRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private FileStorageService fileStorageService;

    @Test
    @WithMockUser(username = "other@example.com", roles = "CITIZEN")
    public void getFile_UnauthorizedUser_ReturnsForbidden() throws Exception {
        User owner = User.builder().email("owner@example.com").build();
        Application app = Application.builder().user(owner).identityProofUrl("file.pdf").build();

        when(applicationRepository.findByAnyDocumentUrl(anyString())).thenReturn(Optional.of(app));
        when(userRepository.findByEmailIgnoreCase("other@example.com")).thenReturn(Optional.of(User.builder().role("CITIZEN").build()));

        mockMvc.perform(get("/api/applications/files/file.pdf"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "CITIZEN")
    public void getFile_OwnerUser_ReturnsOk() throws Exception {
        User owner = User.builder().email("owner@example.com").build();
        Application app = Application.builder().user(owner).identityProofUrl("file.pdf").build();

        when(applicationRepository.findByAnyDocumentUrl(anyString())).thenReturn(Optional.of(app));
        when(userRepository.findByEmailIgnoreCase("owner@example.com")).thenReturn(Optional.of(User.builder().email("owner@example.com").role("CITIZEN").build()));
        when(fileStorageService.loadFileAsResource(anyString())).thenReturn(new ByteArrayResource("test content".getBytes()));

        mockMvc.perform(get("/api/applications/files/file.pdf"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "rto@ivtms.gov.in", roles = "RTO")
    public void getFile_RtoUser_ReturnsOk() throws Exception {
        User owner = User.builder().email("owner@example.com").build();
        Application app = Application.builder().user(owner).identityProofUrl("file.pdf").build();

        when(applicationRepository.findByAnyDocumentUrl(anyString())).thenReturn(Optional.of(app));
        when(userRepository.findByEmailIgnoreCase("rto@ivtms.gov.in")).thenReturn(Optional.of(User.builder().role("RTO").build()));
        when(fileStorageService.loadFileAsResource(anyString())).thenReturn(new ByteArrayResource("test content".getBytes()));

        mockMvc.perform(get("/api/applications/files/file.pdf"))
                .andExpect(status().isOk());
    }
}
