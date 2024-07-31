package com.tunapearl.saturi.repository.redis;

import com.tunapearl.saturi.domain.user.RedisToken;
import org.springframework.data.repository.CrudRepository;

public interface TokenRepository extends CrudRepository<RedisToken, Long> {


}
