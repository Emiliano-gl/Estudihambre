delimiter //
create trigger actSocio after delete on socio
for each row 
begin
delete from restaurante where rfc_socio = old.rfc;
end//

delimiter %%
create trigger actTipoComidaRes before delete on restaurante
for each row
begin
delete from tipo_comida_restaurante where clave_res = old.clave;
end %%

delimiter $$
create trigger actEval before delete on restaurante
for each row
begin
delete from evalua where clave_res = old.clave;
end $$

delimiter //
create trigger actRes before delete on socio
for each row 
begin
delete from restaurante where rfc_socio = old.rfc;
end//

delimiter //
create trigger actTipoComidaCli before delete on cliente
for each row
begin
delete from tipo_comida_cliente where usuario = old.nombreUsuario;
end//

delimiter //
create trigger actEvalC before delete on cliente
for each row 
begin 
delete from evalua where usuario = old.nombreUsuario;
end//