package com.tunapearl.saturi.repository.redis;

import com.tunapearl.saturi.domain.game.person.PersonChatRoom;
import org.springframework.data.repository.CrudRepository;

public interface PersonChatRoomRepository extends CrudRepository<PersonChatRoom, String> {
}
