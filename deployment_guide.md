# ☁️ Deployment Guide

This guide covers how to deploy the **Fine-Grained Permission System** to production using popular SaaS-friendly platforms.

---

## 1. Database Setup (Supabase / AWS RDS)
1. Create a PostgreSQL project on [Supabase](https://supabase.com/).
2. Copy the **Database URL** (Connection String).
3. Ensure the password does not contain special characters that require URL encoding, or encode them properly.

---

## 2. Backend Deployment (Render / Railway)

### Recommended: Render.com
1. **Create a Web Service**: Link your GitHub repository.
2. **Environment**: Python.
3. **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4. **Start Command**: `gunicorn config.wsgi:application`
5. **Environment Variables**:
   - `SECRET_KEY`: A long, random string.
   - `DEBUG`: `False`
   - `DATABASE_URL`: Your Supabase connection string.
   - `ALLOWED_HOSTS`: Your Render domain (e.g., `api.onrender.com`).

---

## 3. Frontend Deployment (Vercel / Netlify)

### Recommended: Vercel
1. **Import Project**: Choose the `frontend` subdirectory.
2. **Framework Preset**: Vite.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your backend URL (e.g., `https://fine-grained-api.onrender.com`).

---

## 🏗️ Production Checklist
- [ ] Set `DEBUG=False` in backend.
- [ ] Securely manage `SECRET_KEY`.
- [ ] Update `CORS_ALLOWED_ORIGINS` in `settings.py` to only include your frontend domain.
- [ ] Run `python manage.py collectstatic`.
- [ ] Ensure all API requests in frontend use an environment-based base URL.
