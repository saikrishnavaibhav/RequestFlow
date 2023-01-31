package com.requestflow;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.WebApplicationContext;

import com.requestflow.repositories.RequestRepository;
import com.requestflow.service.RequestFlowService;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.MOCK, classes = { RequestFlowApplication.class })
@WebAppConfiguration
class RequestFlowApplicationTests {

	@Autowired
	private WebApplicationContext webApplicationContext;

	@MockBean
	RequestFlowService requestFlowService;

	@MockBean
	RequestRepository requestRepository;
	
	@Autowired
	RestTemplate restTemplate;
	
	private MockMvc mockMvc;

	
	@BeforeEach
	public void setup() throws Exception {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
		
	}
	
	@Test
	void testRegisterUser() throws Exception {
		
		when(requestFlowService.signupUser(any())).thenReturn(ResponseEntity.ok().build());
		
		mockMvc.perform(post("/api/signup")
				   .contentType(MediaType.APPLICATION_JSON)
				   .content("{{\n"
				   		+ "    \"userName\": \"vaibhav\",\n"
				   		+ "    \"firstName\": \"vaibhav\",\n"
				   		+ "    \"lastName\": \"yellampalli\",\n"
				   		+ "    \"emailId\": \"vaibhav@gmail.com\",\n"
				   		+ "    \"password\": \"Password@123\",\n"
				   		+ "}")						
				   .accept(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk());
	}

}
