package com.ar.edu.unnoba.poo2025.torneos.util;

import com.password4j.Password;

public class PasswordEncoder {
 /**
     * Recibe un password en texto plano y retorna un hash de Bcrypt.
     * @param rawPassword La contraseña en texto plano.
     * @return El hash Bcrypt como un String.
     */
    public String encode(String rawPassword) {
        // Usamos el constructor fluido de Password4j para hashear con Bcrypt
        return Password.hash(rawPassword)
                       .withBcrypt()
                       .getResult();
    }

    /**
     * Recibe un password en texto plano y un password-hash y verifica 
     * que sean válidos entre sí.
     * @param rawPassword La contraseña en texto plano (la que ingresa el usuario).
     * @param encodedPassword El hash guardado en la base de datos.
     * @return true si coinciden, false en caso contrario.
     */
    public boolean verify(String rawPassword, String encodedPassword) {
        // Usamos el constructor fluido para verificar la contraseña contra el hash
        return Password.check(rawPassword, encodedPassword)
                       .withBcrypt();
    }
}