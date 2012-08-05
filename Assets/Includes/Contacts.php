<?php
    $json = array(
        array(
            "id" => 00
            "name" => "Joe Bloggs",
            "age" => 12, 
            "address" => "9 Cables Street, London",
            "role" => "Manager"
        ),
        array(
            "id" => 01
            "name" => "Dan Smith",
            "age" => 23, 
            "address" => "Bambridge Road, Essex",
            "role" => "Developer"
        ),
        array(
            "id" => 02
            "name" => "Bradley Few",
            "age" => 22, 
            "address" => "Meeson Mead, Leads",
            "role" => "Developer"
        )
    );
    
    echo json_encode($json);
?>