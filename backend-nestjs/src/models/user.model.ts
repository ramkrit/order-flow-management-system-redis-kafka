import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: true,
})
export class Users extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        field: 'name',
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare storeName: string;

    @Column({
        field: 'phone_number',
        type: DataType.STRING(20),
        allowNull: false,
    })
    declare phoneNumber: string;

    @Column({
        field: 'is_active',
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    declare isActive: boolean;

    @Column({
        field: 'is_deleted',
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare isDeleted: boolean;

    @CreatedAt
    @Column({
        field: 'created_at',
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare createdAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at',
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare updatedAt: Date;
}
