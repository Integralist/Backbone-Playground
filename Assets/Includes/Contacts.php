<?php
	$json = array(
		array(
			"name" => "Joe Bloggs",
			"age" => 12, 
			"address" => "9 Cables Street, London",
			"role" => "Manager"
		),
		array(
			"name" => "Dan Smith",
			"age" => 23, 
			"address" => "Bambridge Road, Essex",
			"role" => "Developer"
		),
		array(
			"name" => "Bradley Few",
			"age" => 22, 
			"address" => "Meeson Mead, Leads",
			"role" => "Developer"
		)
	);
	
	echo json_encode($json);
?>