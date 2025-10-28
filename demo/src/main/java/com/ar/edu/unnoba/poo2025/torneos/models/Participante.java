package com.ar.edu.unnoba.poo2025.torneos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("PARTICIPANTE")
@Getter
@Setter

public class Participante extends Usuario {

    //no se genera ID porque hereda de Usuario

    @Column(name = "nombre", length = 50)
    private String nombre;

    @Column(name = "apellido", length = 50)
    private String apellido;

    @Column(name = "tipo_documento", length = 20)
    private String tipoDocumento;

    @Column(name = "numero_documento", unique = true, length = 20)
    private String numeroDocumento;

    // Constructor vacío requerido por JPA
    public Participante() {}

    // Constructor con argumentos
    public Participante(String email, String password, String nombre, String apellido, String tipoDocumento, String numeroDocumento) {
        super.setEmail(email);
        super.setPassword(password);
        this.nombre = nombre;
        this.apellido = apellido;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
    }
}
