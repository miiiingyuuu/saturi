package com.tunapearl.saturi.repository.redis;

import com.tunapearl.saturi.domain.game.ChatRoom;
import org.springframework.data.repository.CrudRepository;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, String> {


}
