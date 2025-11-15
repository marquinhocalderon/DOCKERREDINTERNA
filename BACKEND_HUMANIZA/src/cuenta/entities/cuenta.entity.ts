import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cuenta' })
export class Cuenta {
    @PrimaryColumn({ name: 'id_usuario' })
    idUsuario: number;

    @OneToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @Column({ nullable: false })
    plan: string;

    @Column({ nullable: false })
    fechaCreacion: Date;

    @Column({ nullable: true })
    fechaExpiracion: Date;

    @Column({ nullable: true })
    p_fecha: Date;

    @Column({ default: 0 })
    p_minuto: number;

    @Column({ default: 0 })
    p_dia: number;

    @Column({ default: true })
    estado: boolean;
}
