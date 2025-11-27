package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import java.util.List;

public interface AdminService {
    void create(Administrador admin) throws Exception;
    List<Administrador> getAll();
    void delete(Long id, String currentAdminEmail) throws Exception;
    Administrador findByEmail(String email); // Necesario para el login
}