#!/bin/bash
# Проверка DNS-записей для proffssv.site

echo "🔍 Проверка DNS для proffssv.site..."
echo ""

echo "=== nslookup ==="
nslookup proffssv.site
echo ""

echo "=== dig (A-запись) ==="
dig proffssv.site +short
echo ""

echo "=== dig (CNAME для www) ==="
dig www.proffssv.site +short
echo ""

echo "✅ Ожидаемый IP: 76.76.21.21 (или другой от Vercel)"
echo "⏳ DNS-распространение может занять 5-15 минут"
