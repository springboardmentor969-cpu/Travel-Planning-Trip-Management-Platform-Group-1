package com.tripnest.service;

import com.tripnest.dto.UserDto;
import com.tripnest.entity.User;
import com.tripnest.exception.DuplicateResourceException;
import com.tripnest.exception.ResourceNotFoundException;
import com.tripnest.mapper.UserMapper;
import com.tripnest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto create(UserDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new DuplicateResourceException("A user with this email already exists");
        }
        User user = new User();
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserDto get(Long id) {
        return UserMapper.toDto(findEntity(id));
    }

    public UserDto update(Long id, UserDto dto) {
        User user = findEntity(id);
        userRepository.findByEmail(dto.email())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("A user with this email already exists");
                });
        UserMapper.updateEntity(user, dto);
        return UserMapper.toDto(userRepository.save(user));
    }

    public User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }
}
