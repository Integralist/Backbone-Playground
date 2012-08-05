<?php
    $json = array(
        array(
            "id" => 99,
            "name" => "Joe Bloggs",
            "age" => 12, 
            "address" => "9 Cables Street, London",
            "role" => "Manager"
        ),
        array(
            "id" => 98,
            "name" => "Dan Smith",
            "age" => 23, 
            "address" => "Bambridge Road, Essex",
            "role" => "Developer"
        ),
        array(
            "id" => 97,
            "name" => "Bradley Few",
            "age" => 22, 
            "address" => "Meeson Mead, Leads",
            "role" => "Developer"
        )
    );
    
    echo json_encode($json);
?>