import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class dbsetup1669448420554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'business_owner',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          { name: 'name', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'time_slot',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buId',
            type: 'integer',
          },
          { name: 'date', type: 'date' },
          { name: 'from', type: 'time' },
          { name: 'to', type: 'time' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'time_slot',
      new TableForeignKey({
        columnNames: ['buId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_owner',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'event_type',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buId',
            type: 'integer',
          },
          { name: 'name', type: 'varchar' },
          { name: 'numberOfSlot', type: 'integer' },
          { name: 'isDefault', type: 'boolean' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'event_type',
      new TableForeignKey({
        columnNames: ['buId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_owner',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'unavailable_time_period',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buId',
            type: 'integer',
          },
          { name: 'name', type: 'varchar' },
          { name: 'from', type: 'time' },
          { name: 'to', type: 'time' },
          { name: 'affectToMonday', type: 'boolean' },
          { name: 'affectToTuesday', type: 'boolean' },
          { name: 'affectToWednesday', type: 'boolean' },
          { name: 'affectToThursday', type: 'boolean' },
          { name: 'affectToFriday', type: 'boolean' },
          { name: 'affectToSaturday', type: 'boolean' },
          { name: 'affectToSunday', type: 'boolean' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'unavailable_time_period',
      new TableForeignKey({
        columnNames: ['buId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_owner',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'unavailable_date',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buId',
            type: 'integer',
          },
          { name: 'name', type: 'varchar' },
          { name: 'date', type: 'date' },
          { name: 'from', type: 'time', isNullable: true },
          { name: 'to', type: 'time', isNullable: true },
          { name: 'isAllDay', type: 'boolean', default: true },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'unavailable_date',
      new TableForeignKey({
        columnNames: ['buId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_owner',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'config_parameter',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buId',
            type: 'integer',
          },
          { name: 'maxClientsPerSlot', type: 'integer' },
          { name: 'minutesPerSlot', type: 'integer' },
          { name: 'breakBetweenSlotInMinute', type: 'integer' },
          { name: 'mondayOpenFrom', type: 'time', isNullable: true },
          { name: 'mondayOpenTo', type: 'time', isNullable: true },
          { name: 'tuesdayOpenFrom', type: 'time', isNullable: true },
          { name: 'tuesdayOpenTo', type: 'time', isNullable: true },
          { name: 'wednesdayOpenFrom', type: 'time', isNullable: true },
          { name: 'wednesdayOpenTo', type: 'time', isNullable: true },
          { name: 'thursdayOpenFrom', type: 'time', isNullable: true },
          { name: 'thursdayOpenTo', type: 'time', isNullable: true },
          { name: 'fridayOpenFrom', type: 'time', isNullable: true },
          { name: 'fridayOpenTo', type: 'time', isNullable: true },
          { name: 'saturdayOpenFrom', type: 'time', isNullable: true },
          { name: 'saturdayOpenTo', type: 'time', isNullable: true },
          { name: 'sundayOpenFrom', type: 'time', isNullable: true },
          { name: 'sundayOpenTo', type: 'time', isNullable: true },
          { name: 'activeFrom', type: 'date' },
          { name: 'activeTo', type: 'date' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'config_parameter',
      new TableForeignKey({
        columnNames: ['buId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_owner',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'booking',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buId',
            type: 'integer',
          },
          {
            name: 'eventTypeId',
            type: 'integer',
          },
          { name: 'clientEmail', type: 'varchar' },
          { name: 'clientFirstname', type: 'varchar' },
          { name: 'clientLastname', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['buId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'business_owner',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['eventTypeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'event_type',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'booking_time_slot',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'bookingId',
            type: 'integer',
          },
          {
            name: 'timeSlotId',
            type: 'integer',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'booking_time_slot',
      new TableForeignKey({
        columnNames: ['bookingId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'booking',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'booking_time_slot',
      new TableForeignKey({
        columnNames: ['timeSlotId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'time_slot',
        onDelete: 'CASCADE',
      }),
    );

    try {
      await queryRunner.query(`INSERT INTO \`business_owner\` (\`id\`, \`name\` ) VALUES
            (1, 'Men Haircut'),
            (2, 'Woman Haircut')`);

      await queryRunner.query(`INSERT INTO \`event_type\` (\`buId\`, \`name\`, \`numberOfSlot\`, \`isDefault\` ) VALUES
        (1, 'Hair cut', 1, true),
        (2, 'Hair coloring', 1, true),
        (2, 'Hair cut', 1, false)`);

      await queryRunner.query(`INSERT INTO \`unavailable_time_period\` (\`buId\`, \`name\`, \`from\`, \`to\`, \`affectToMonday\`, \`affectToTuesday\`, \`affectToWednesday\`, \`affectToThursday\`, \`affectToFriday\`, \`affectToSaturday\`, \`affectToSunday\` ) VALUES
        (1, 'Lunch Break', '12:00', '13:00', true, true, true, true, true, true, false),
        (2, 'Lunch Break', '12:00', '13:00', true, true, true, true, true, true, false),
        (1, 'Cleaning Break', '15:00', '16:00', true, true, true, true, true, true, false),
        (2, 'Cleaning Break', '15:00', '16:00', true, true, true, true, true, true, false)
        `);

      await queryRunner.query(`INSERT INTO \`unavailable_date\` (\`buId\`, \`name\`, \`date\`, \`isAllDay\` ) VALUES
            (1, 'Public holiday', '2022-11-28', true),
            (2, 'Public holiday', '2022-11-28', true)`);

      await queryRunner.query(`INSERT INTO \`config_parameter\` (\`buId\`, \`maxClientsPerSlot\`, \`minutesPerSlot\`, \`breakBetweenSlotInMinute\`, \`mondayOpenFrom\`, \`mondayOpenTo\`, \`tuesdayOpenFrom\`, \`tuesdayOpenTo\`, \`wednesdayOpenFrom\`, \`wednesdayOpenTo\`, \`thursdayOpenFrom\`, \`thursdayOpenTo\`, \`fridayOpenFrom\`, \`fridayOpenTo\`, \`saturdayOpenFrom\`, \`saturdayOpenTo\`, \`sundayOpenFrom\`, \`sundayOpenTo\`, \`activeFrom\`, \`activeTo\` ) VALUES
            (1, 3, 10, 5, '08:00', '20:00', '08:00', '20:00', '08:00', '20:00', '08:00', '20:00', '08:00', '20:00', '10:00', '22:00', null, null, '2022-11-01', '2022-12-31'),
            (2, 3, 60, 10, '08:00', '20:00', '08:00', '20:00', '08:00', '20:00', '08:00', '20:00', '08:00', '20:00', '10:00', '22:00', null, null, '2022-11-01', '2022-12-31')`);
    } catch (error) {
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
