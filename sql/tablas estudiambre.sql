create table if not exists cliente(
	correo nvarchar(255) unique not null,
    claveAcceso varchar(20) not null,
    nombreUsuario nvarchar(50) not null,
    nombre nvarchar(50) not null,
    primary key(nombreUsuario)
);

create table if not exists socio(
	rfc varchar(13) not null,
    correo nvarchar(255) not null,
    claveAcceso varchar(20) not null,
    nombre nvarchar(50) not null,
    primary key(rfc)
);

create table if not exists restaurante(
	clave varchar(15) not null,
    precioMinimo int not null,
    precioMaximo int not null,
    telefono varchar(15) not null,
    direccion nvarchar(100) not null,
	nombreEstablecimiento nvarchar(80) not null,
    rfc_socio varchar(13) not null,
    primary key(clave),
    foreign key(rfc_socio) references socio(rfc)
);

create table if not exists evalua(
	clave_res varchar(15) not null,
    usuario nvarchar(50) not null,
    puntuacion tinyint not null,
    comentario nvarchar(255),
    foreign key(clave_res) references restaurante(clave),
    foreign key(usuario) references cliente(nombreUsuario)
);

create table if not exists tipo_comida_restaurante(
	clave_res varchar(15) not null,
    tipo_de_comida nvarchar(20) not null,
    foreign key(clave_res) references restaurante(clave)
);

create table if not exists tipo_comida_cliente(
	usuario nvarchar(50) not null,
    tipo_de_comida nvarchar(20) not null,
    foreign key(usuario) references cliente(nombreUsuario)
);
