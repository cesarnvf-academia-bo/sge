#!/bin/bash

set -e

PGPASSWORD=123qwe psql -h localhost -U postgres -c "CREATE DATABASE sgedb;" 2>/dev/null || echo "La base de datos ya existe"

psql -h localhost -U postgres -d sgedb -f tablas.sql
psql -h localhost -U postgres -d sgedb -f datos.sql

echo "Base de datos inicializada correctamente"
