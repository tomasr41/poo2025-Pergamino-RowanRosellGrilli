package com.ar.edu.unnoba.poo2025.torneos;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.repository.AdministradorRepository;
import com.ar.edu.unnoba.poo2025.torneos.repository.ParticipanteRepository;
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;

//Component
public class DataLoader implements CommandLineRunner {

    private final ParticipanteRepository partRepo;
    private final AdministradorRepository adminRepo;

    public DataLoader(ParticipanteRepository partRepo, AdministradorRepository adminRepo) {
        this.partRepo = partRepo;
        this.adminRepo = adminRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        Participante p1 = new Participante("ana@mail.com", "1234", "Ana", "Gómez", "DNI", "25123456");
        partRepo.save(p1);

        Administrador a1 = new Administrador("admin@mail.com", "admin123");
        adminRepo.save(a1);

        Administrador a2 = new Administrador("jefe@mail.com", "sadmin");
        adminRepo.save(a2);

        Participante p2 = new Participante("leo@mail.com", "goat", "Leo", "Messi", "DNI", "33101010");
        partRepo.save(p2);

        System.out.println("Datos cargados ✅");
    }
}

