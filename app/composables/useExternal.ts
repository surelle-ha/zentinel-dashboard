import { ref } from 'vue'

export function useExternal() {
    const countries = ref<any[]>([])

    const getCountriesByName = async () => {
        const result = await fetch('https://restcountries.com/v3.1/all?fields=name')
        if (!result.ok) {
            console.error('Error fetching countries:', result.statusText)
            return
        }
        const data = await result.json()
        countries.value = Array.isArray(data) ? data.map((country: any) => country.name.common) : []
    }

    return {
        countries,
        getCountriesByName,
    }
}