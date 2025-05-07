#!/bin/bash

# Script para generar o verificar las claves JWT

# Definir rutas
JWT_DIR="${JWT_DIR:-config/jwt}"
PRIVATE_KEY="${JWT_DIR}/private.pem"
PUBLIC_KEY="${JWT_DIR}/public.pem"

# Verificar que la passphrase está configurada
if [ -z "$JWT_PASSPHRASE" ]; then
    # Intentar extraer de .env.local si existe
    if [ -f .env.local ]; then
        JWT_PASSPHRASE=$(grep JWT_PASSPHRASE .env.local | cut -d '=' -f2)
    fi
    
    # Si sigue siendo vacío, usar un valor por defecto para desarrollo
    if [ -z "$JWT_PASSPHRASE" ]; then
        JWT_PASSPHRASE="desarrollo"
        echo "⚠️ ADVERTENCIA: Usando passphrase de desarrollo por defecto."
        echo "Se recomienda establecer JWT_PASSPHRASE en .env.local para entornos de producción."
    fi
fi

# Crear directorio si no existe
mkdir -p ${JWT_DIR}

# Verificar si las claves ya existen
if [ -f "${PRIVATE_KEY}" ] && [ -f "${PUBLIC_KEY}" ]; then
    echo "✅ Las claves JWT ya existen."
    
    # Verificar permisos
    if [ "$(stat -c %a ${PRIVATE_KEY})" != "600" ]; then
        echo "⚠️ Corrigiendo permisos de clave privada..."
        chmod 600 ${PRIVATE_KEY}
    fi
    
    if [ "$(stat -c %a ${PUBLIC_KEY})" != "644" ]; then
        echo "⚠️ Corrigiendo permisos de clave pública..."
        chmod 644 ${PUBLIC_KEY}
    fi
    
    echo "✅ Permisos de claves verificados."
else
    echo "🔑 Generando nuevas claves JWT..."
    
    # Generar clave privada
    openssl genpkey -out ${PRIVATE_KEY} -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:${JWT_PASSPHRASE}
    
    # Generar clave pública
    openssl pkey -in ${PRIVATE_KEY} -out ${PUBLIC_KEY} -pubout -passin pass:${JWT_PASSPHRASE}
    
    # Establecer permisos correctos
    chmod 600 ${PRIVATE_KEY}
    chmod 644 ${PUBLIC_KEY}
    
    echo "✅ Nuevas claves JWT generadas con éxito."
fi

echo "📝 Información de las claves:"
ls -la ${JWT_DIR}

echo "🔒 Configuración JWT completa."
