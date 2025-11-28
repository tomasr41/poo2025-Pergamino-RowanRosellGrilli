package com.ar.edu.unnoba.poo2025.torneos;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.repository.ParticipanteRepository;
import com.ar.edu.unnoba.poo2025.torneos.repository.AdministradorRepository;
import com.ar.edu.unnoba.poo2025.torneos.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Componente que carga datos iniciales en la base de datos al arrancar la aplicación.
 * Útil para pruebas y desarrollo.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ParticipanteRepository participanteRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    // Inyectamos nuestra utilidad de encriptación.
    // Es CRÍTICO usar esto para guardar contraseñas, ya que el login espera hashes, no texto plano.
    @Autowired
    private PasswordEncoder passwordEncoder; 

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Iniciando carga de datos de prueba ---");

        // 1. Crear un PARTICIPANTE de prueba
        if (participanteRepository.findByEmail("ana@mail.com") == null) {
            Participante p = new Participante();
            p.setEmail("ana@mail.com");
            p.setNombre("Ana");
            p.setApellido("García");
            p.setNumeroDocumento("12345678");
            p.setTipoDocumento("DNI");
            
            // Encriptamos la contraseña
            String passwordEncriptada = passwordEncoder.encode("1234");
            p.setPassword(passwordEncriptada);
            
            participanteRepository.save(p);
            System.out.println(">> Participante creado: ana@mail.com (Pass: 1234)");
        } else {
            System.out.println(">> El participante ana@mail.com ya existe.");
        }

        // 2. Crear un ADMINISTRADOR de prueba
        // Verificamos si existe buscando por email en el repositorio de admins
        if (administradorRepository.findByEmail("admin@mail.com").isEmpty()) {
            Administrador a = new Administrador();
            a.setEmail("admin@mail.com");
            
            // Encriptamos la contraseña del admin
            a.setPassword(passwordEncoder.encode("admin123"));
            
            administradorRepository.save(a);
            System.out.println(">> Administrador creado: admin@mail.com (Pass: admin123)");
        } else {
             System.out.println(">> El administrador admin@mail.com ya existe.");
        }

        System.out.println("--- Carga de datos finalizada ---");
    }
}