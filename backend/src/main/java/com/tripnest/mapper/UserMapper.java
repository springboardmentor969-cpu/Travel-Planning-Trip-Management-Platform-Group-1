package com.tripnest.mapper;

import com.tripnest.dto.UserDto;
import com.tripnest.entity.User;

public final class UserMapper {
    private UserMapper() {
    }

    public static UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }

    public static void updateEntity(User user, UserDto dto) {
        user.setName(dto.name());
        user.setEmail(dto.email());
    }
}
