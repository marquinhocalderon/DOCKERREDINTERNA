import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'estadistica' })
export class Estadistica {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.id, { eager: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @Column({ nullable: false })
    fechadia: Date;

    @Column({ nullable: false })
    totalpeticiones: number;

    @Column({ nullable: false })
    plan: string;

}
