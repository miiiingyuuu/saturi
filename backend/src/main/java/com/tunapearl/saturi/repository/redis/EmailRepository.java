package com.tunapearl.saturi.repository.redis;

import com.tunapearl.saturi.domain.user.RedisEmail;
import org.springframework.data.repository.CrudRepository;

public interface EmailRepository extends CrudRepository<RedisEmail, String> {

}
