DROP KEYSPACE IF EXISTS tasks;

CREATE KEYSPACE tasks WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };