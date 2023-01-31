package com.requestflow.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.requestflow.entities.Role;
import com.requestflow.jwt.JwtUtils;
import com.requestflow.repositories.RoleRepository;
import com.requestflow.repositories.UserRepository;
import com.requestflow.requests.SignupRequest;

@ExtendWith(MockitoExtension.class)
class RequestFlowServiceTest {
	
	@Mock
	UserRepository userRepository;
	
	@Mock
	RoleRepository roleRepository;
	
	@Mock
    JwtUtils jwtUtils;
	
	@Mock
	PasswordEncoder encoder;
	
	@InjectMocks
	private RequestFlowService requestFlowService = new RequestFlowService();
	
	@Test
	void testSignupUser() {
		
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmailId("approver@gmail.com");
		signupRequest.setFirstName("vaibhav");
		signupRequest.setLastName("yellampalli");
		signupRequest.setPassword("Password@123");
		signupRequest.setUserName("vaibhav");
		when(userRepository.existsByUserName(signupRequest.getUserName())).thenReturn(Boolean.FALSE);
		when(userRepository.save(any())).thenReturn(null);
		Optional<Role> role = Optional.of(new Role());
		when(roleRepository.findByRole(any())).thenReturn(role);
		when(encoder.encode(any())).thenReturn("");
		ResponseEntity<?> responseEntity = requestFlowService.signupUser(signupRequest);
		assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
	}

//	@Test
//	void testSubmitRequestForApproval() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testGetRequests() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testGetRequestsOfUser() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testStreamToString() {
//		fail("Not yet implemented");
//	}
//
//
//	@Test
//	void testAssignRequest() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testViewRequest() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testApproveRequest() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testRetrieveNotifications() {
//		fail("Not yet implemented");
//	}
//
//	@Test
//	void testReadNotification() {
//		fail("Not yet implemented");
//	}

}
