# Setting Up Paid Gemini API Access (Option B)

To process the remaining entries without hitting the 20 requests/day limit, you need an API key linked to a Google Cloud project with an active billing account.

Here are the step-by-step instructions to set this up:

## 1. Set Up Google Cloud Billing
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. In the navigation menu (hamburger icon on the top left), go to **Billing**.
4. Click **Add Billing Account** or **Manage Billing Accounts**, and follow the prompts to add a credit card. (Google Cloud usually gives new users $300 in free credits to start).

## 2. Create a Google Cloud Project
1. In the top navbar of the Cloud Console, click on the **Project Dropdown** (it might say "Select a project").
2. Click **New Project**.
3. Name it `DiscoveryEngine-AI` (or anything you prefer).
4. Ensure your new Billing Account is linked to this project under the "Billing account" dropdown.
5. Click **Create**.

## 3. Enable the Gemini API
1. Make sure your new `DiscoveryEngine-AI` project is selected in the top navbar.
2. In the search bar at the top, type **"Generative Language API"** and select it from the marketplace results.
3. Click the blue **Enable** button.

## 4. Generate the Paid API Key
1. Now, go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Click **Create API key**.
3. *Important:* In the popup, **do not** select "Create API key in new project" (which uses the free tier). Instead, select the `DiscoveryEngine-AI` project you just created in Google Cloud from the dropdown.
4. Click **Create API key in existing project**.
5. Copy the generated key.

## 5. Update Your Code
1. Open the `.env` file in this repository.
2. Replace your old key with the new paid key:
   ```env
   GEMINI_API_KEY=your_new_paid_key_here
   ```
3. Save the file.
4. Run the enrichment step again:
   ```bash
   python pipeline/run_pipeline.py --step enrich
   ```

> [!TIP]
> **Pricing Context:** The `gemini-3.6-flash` model is incredibly cheap. Processing our remaining 777 entries will likely cost less than $0.15 USD in total API credits.
