package com.ar.edu.unnoba.poo2025.torneos.resource;

import com.ar.edu.unnoba.poo2025.torneos.dto.AdminResponseDTO;
import com.ar.edu.unnoba.poo2025.torneos.dto.AuthenticationRequestDTO;
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.service.AdminService;
import com.ar.edu.unnoba.poo2025.torneos.service.AuthenticationService;
import com.ar.edu.unnoba.poo2025.torneos.service.AuthorizationService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminResource {

    @Autowired private AdminService adminService;
    @Autowired private AuthenticationService authenticationService;
    @Autowired private AuthorizationService authorizationService;
    @Autowired private ModelMapper modelMapper;

    // 1. Login de Administrador
    @PostMapping("/auth")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequestDTO request) {
        try {
            Administrador admin = modelMapper.map(request, Administrador.class);
            String token = authenticationService.authenticateAdmin(admin);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // 2. Obtener todas las cuentas de admin
    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts(@RequestHeader("Authorization") String token) {
        try {
            authorizationService.authorizeAdmin(token); // Validar token de admin
            List<Administrador> admins = adminService.getAll();
            Type listType = new TypeToken<List<AdminResponseDTO>>() {}.getType();
            List<AdminResponseDTO> dtos = modelMapper.map(admins, listType);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // 3. Crear nueva cuenta de admin
    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@RequestHeader("Authorization") String token, 
                                           @RequestBody AuthenticationRequestDTO request) {
        try {
            authorizationService.authorizeAdmin(token); // Validar token de admin
            Administrador newAdmin = modelMapper.map(request, Administrador.class);
            adminService.create(newAdmin);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 4. Borrar cuenta de admin
    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String token, 
                                           @PathVariable Long id) {
        try {
            Administrador currentAdmin = authorizationService.authorizeAdmin(token);
            // Pasamos el email del admin actual para validar que no se borre a sí mismo
            adminService.delete(id, currentAdmin.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}