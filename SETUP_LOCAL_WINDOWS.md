# Janta Dental Clinic - Local Windows Setup Guide
Target Local Directory: `E:\Websites\janta clinic`

---

## Option 1: Using the 1-Click Project ZIP (Fastest)

1. Open the clinic admin panel in your browser.
2. Go to **Settings & Database** > **Save Project to Local Directory**.
3. Click **"Download Project Source ZIP"** to download `janta-clinic-source.zip`.
4. Open **PowerShell** on your Windows computer and paste the following commands:

```powershell
# Create target directory
New-Item -ItemType Directory -Force -Path "E:\Websites\janta clinic"

# Extract downloaded ZIP directly into E:\Websites\janta clinic
Expand-Archive -Path "$HOME\Downloads\janta-clinic-source.zip" -DestinationPath "E:\Websites\janta clinic" -Force

# Navigate into project directory
cd "E:\Websites\janta clinic"

# Install dependencies and start local server
npm install
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Option 2: Using Command Prompt / Manual Unzip

1. Download `janta-clinic-source.zip`.
2. Move `janta-clinic-source.zip` into `E:\Websites\janta clinic`.
3. Right-click the ZIP file and select **"Extract All..."**, setting the destination to:
   ```
   E:\Websites\janta clinic
   ```
4. Open **Command Prompt** (cmd.exe):
   ```cmd
   cd /d "E:\Websites\janta clinic"
   npm install
   npm run dev
   ```

---

## Option 3: Using Git

If you push this project to GitHub:

```cmd
mkdir "E:\Websites\janta clinic"
cd /d "E:\Websites\janta clinic"
git clone <YOUR_GITHUB_REPOSITORY_URL> .
npm install
npm run dev
```

---

## Default Login Credentials

- **Username**: `admin`
- **Password**: `ChangeOnFirstLogin123`
*(On first login, the system will prompt you to set your strong private password).*

## Clinic Configuration
- **Branch 1**: P-55 Raghubir Nagar, New Delhi 110027
- **Branch 2**: RZ/E-158 Nihal Vihar, Nangloi, New Delhi 110041
- **Director / Lead Dental Surgeon**: Dr. LP Diwakar (BDS, MDS Oral & Maxillofacial Surgery)
- **Support / WhatsApp Contact**: 9899007819
