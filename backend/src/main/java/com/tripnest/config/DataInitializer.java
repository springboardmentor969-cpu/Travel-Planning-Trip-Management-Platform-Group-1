package com.tripnest.config;

import com.tripnest.entity.Role;
import com.tripnest.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer {

    @Autowired
    private RoleRepository roleRepository;

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            initializeRoles();
        };
    }

    @Transactional
    public void initializeRoles() {
        if (roleRepository.findByName("USER").isEmpty()) {
            Role userRole = new Role("USER", "Standard user role");
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Role adminRole = new Role("ADMIN", "Administrator role");
            roleRepository.save(adminRole);
        }
    }
}
