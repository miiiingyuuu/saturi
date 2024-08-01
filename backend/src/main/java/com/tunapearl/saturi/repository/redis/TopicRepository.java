package com.tunapearl.saturi.repository.redis;

import com.tunapearl.saturi.domain.game.GameRoomTopic;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends CrudRepository<GameRoomTopic, String> {
}
