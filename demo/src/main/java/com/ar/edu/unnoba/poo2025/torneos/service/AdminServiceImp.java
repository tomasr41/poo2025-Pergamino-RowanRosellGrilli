package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.repository.AdministradorRepository;
import com.ar.edu.unnoba.poo2025.torneos.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImp implements AdminService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void create(Administrador admin) throws Exception {
        if (administradorRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new Exception("Ya existe un administrador con ese email.");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        administradorRepository.save(admin);
    }

    @Override
    public List<Administrador> getAll() {
        return administradorRepository.findAll();
    }

    @Override
    public void delete(Long id, String currentAdminEmail) throws Exception {
        Optional<Administrador> adminToDelete = administradorRepository.findById(id);
        
        if (adminToDelete.isEmpty()) {
            throw new Exception("Administrador no encontrado.");
        }

        if (adminToDelete.get().getEmail().equals(currentAdminEmail)) {
            throw new Exception("No puedes borrarte a ti mismo.");
        }

        administradorRepository.deleteById(id);
    }

    @Override
    public Administrador findByEmail(String email) {
        return administradorRepository.findByEmail(email).orElse(null);
    }
}