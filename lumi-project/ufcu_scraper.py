import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
import re

DOMAIN = "https://ufcu.org"
OUTPUT_DIR = "ufcu_rag_docs"

# Seed URLs to spider outward from
SEED_URLS = [
    "https://ufcu.org/resources",
    "https://ufcu.org/open-account",
    "https://ufcu.org/personal/checking/overview",
    "https://ufcu.org/personal/savings",
    "https://ufcu.org/personal/loans",
    "https://ufcu.org/personal/credit-cards",
    "https://ufcu.org/business/checking",
    "https://ufcu.org/business/loans",
    "https://ufcu.org/about"
]

# Only keep links that fall under these relevant paths
ALLOWED_PATHS = [
    "/resources",
    "/articles",
    "/open-account",
    "/personal",
    "/business",
    "/about",
    "/join",
    "/membership"
]

def is_valid_link(url):
    """Filters URLs to keep only relevant UFCU pages and avoid PDFs/Images."""
    parsed = urlparse(url)
    if parsed.netloc not in ["ufcu.org", "www.ufcu.org"]:
        return False
        
    path = parsed.path
    # Ignore media and document files that require separate PDF parsers
    if path.endswith(('.pdf', '.jpg', '.png', '.mp4', '.zip')):
        return False
        
    return any(path.startswith(allowed) for allowed in ALLOWED_PATHS)

def get_links(seed_urls):
    """Finds all valid resource and product links from the seed pages."""
    all_links = set(seed_urls)
    
    for seed in seed_urls:
        try:
            response = requests.get(seed, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            for a_tag in soup.find_all('a', href=True):
                href = a_tag['href']
                # Remove URL fragments to avoid duplicate scrapes of the same page
                full_url = urljoin(DOMAIN, href).split('#')[0] 
                
                if is_valid_link(full_url):
                    all_links.add(full_url)
        except Exception as e:
            print(f"Error gathering links from {seed}: {e}")
            
    return list(all_links)

def extract_content(url):
    """Extracts readable text from a given UFCU URL."""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove navigation, footers, and scripts to keep RAG data clean
        for element in soup(["nav", "footer", "script", "style", "header"]):
            element.decompose()
            
        # The main content usually lives in main or body tags
        main_content = soup.find('main') or soup.find('body')
        
        if main_content:
            text = main_content.get_text(separator='\n', strip=True)
            # Clean up excessive newlines
            text = re.sub(r'\n{3,}', '\n\n', text)
            return text
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        
    return ""


def generate_synthetic_onboarding_doc():
    """Creates a custom knowledge document detailing the specific onboarding flow
    of the new UFCU Reimagined application for the RAG LLM to reference."""
    content = """URL: internal://ufcu-reimagined/onboarding-guide
Source: Internal Application Spec
--------------------------------------------------
UFCU Reimagined - App Onboarding Flow & Screen Guide

The onboarding flow consists of the following screens:
1. About (/about): Collects Name, Email, Phone, and University/Employer affiliation. UFCU offers membership to UT, TXST, ACC, and other partners. Anyone can join via the free American Consumer Council option.
2. Address (/address): Collects residential street address, city, state, and zip code. This is required by federal law to verify identity and establish residency.
3. Identity (/identity): Collects Date of Birth (DOB) and Social Security Number (SSN) or ITIN (or an EIN for business accounts). This is strictly required by the USA PATRIOT Act for KYC (Know Your Customer) and AML (Anti-Money Laundering) compliance. UFCU uses bank-level encryption to secure this data.
4. Funding (/funding): Members must fund their new account. The app integrates with Plaid for instant, secure bank-to-bank transfers. Plaid connects to thousands of financial institutions. No credentials are ever stored by UFCU.
5. Secure (/secure): Members set up a secure password for their new digital banking profile. Passwords must meet strict length and complexity requirements to prevent unauthorized access.
6. Goals (/goals): A personalized step where members select financial goals (e.g., Save for a car, Build credit) so UFCU can tailor account recommendations.

Support Hours: Mon - Fri: 8 AM - 5:30 PM, Sat: 10 AM - 2 PM. Phone: (512) 467-8080 or (800) 252-8311.
"""
    filename = os.path.join(OUTPUT_DIR, "ufcu_doc_onboarding_guide.txt")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    print("Spidering core UFCU hubs...")
    resource_links = get_links(SEED_URLS)
    print(f"Found {len(resource_links)} unique pages to process.")
    
    for idx, link in enumerate(resource_links):
        print(f"[{idx+1}/{len(resource_links)}] Scraping: {link}")
        content = extract_content(link)
        
        if content and len(content) > 100: # Ignore empty/stub pages
            # Create a clean, readable filename from the URL path
            parsed_path = urlparse(link).path.strip('/').replace('/', '_') or 'home'
            filename = os.path.join(OUTPUT_DIR, f"ufcu_doc_{parsed_path}.txt")
            
            with open(filename, 'w', encoding='utf-8') as f:
                # Add metadata header for your RAG loader
                f.write(f"URL: {link}\n")
                f.write(f"Source: UFCU Website\n")
                f.write("-" * 50 + "\n\n")
                f.write(content)
                
    print("Injecting custom application onboarding guide...")
    generate_synthetic_onboarding_doc()
    print("Scraping complete. Documents are ready for RAG vectorization.")

if __name__ == "__main__":
    main()