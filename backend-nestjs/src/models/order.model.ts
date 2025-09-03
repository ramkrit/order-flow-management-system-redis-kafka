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
    tableName: 'orders',
    timestamps: true,
})
export class Orders extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({
        field: 'order_id',
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare orderId: string;

    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @Column({
        field: 'amount',
        type: DataType.DECIMAL(10,2),
        allowNull: false,
    })
    declare amount: number;    

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
