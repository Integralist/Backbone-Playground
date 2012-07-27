<?php
	$json = array(
		array(
			"name" => "Mark McDonnell",
			"age" => 30, 
			"address" => "9 Cables Street, London",
			"role" => "Manager"
		),
		array(
			"name" => "Ashley Banks",
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