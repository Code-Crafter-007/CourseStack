

const res = await fetch("https://ujdsbkttudshpbonvurc.supabase.co/functions/v1/create-checkout", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZHNia3R0dWRzaHBib252dXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzgzOTQsImV4cCI6MjA4NjkxNDM5NH0.O4-hcRyUBh4v2QoDNYT52Qza7yoExlZk6kh53_jimgQ",
        "authorization": "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImQ1YmJhYWY2LTY2MjMtNGI4OC1hMGExLTM1ZmJiNThkMDBjOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3VqZHNia3R0dWRzaHBib252dXJjLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1OGQxODJkYy0xYjQyLTQ5ODEtOTA3My0xNGYwN2RkMjNjMDMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc1NDIwOTEwLCJpYXQiOjE3NzU0MTczMTAsImVtYWlsIjoic3R1ZGVudDNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InN0dWRlbnQzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU3R1ZGVudDMiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInJvbGUiOiJzdHVkZW50Iiwic3ViIjoiNThkMTgyZGMtMWI0Mi00OTgxLTkwNzMtMTRmMDdkZDIzYzAzIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NzU0MTczMTB9XSwic2Vzc2lvbl9pZCI6IjQ2NDk1ODFiLWQzZDAtNGY5NC04OTU4LWQyOTkzN2I5YWU0OCIsImlzX2Fub255bW91cyI6ZmFsc2V9.JKfCXXQgGqqHk3qJvQe5-mEw8ldTiHe7R1QA8Aomfg_5ZD5I1iufV7djEX3zFwf9fj_HbE6zQOm47ax1Tedq8g",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-client-info": "supabase-js-web/2.101.1",
        "Referer": "http://127.0.0.1:5173/"
    },
    "body": "{\"courseId\":\"cfca1766-5de0-44d0-9109-26114fe5992b\",\"userId\":\"58d182dc-1b42-4981-9073-14f07dd23c03\"}",
    "method": "POST"
});


console.log(await res.text())