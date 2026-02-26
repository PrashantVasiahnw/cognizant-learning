(function () {
    'use strict'
    // set year in footer info
    const setYear = () => {
        const el = document.getElementById('year')
        if (el) el.textContent = new Date().getFullYear()
    }
    setYear()
    // form submit api
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                const payload = {
                    name: (form.querySelector('#name') || {}).value,
                    email: (form.querySelector('#email') || {}).value,
                    message: (form.querySelector('#message') || {}).value
                }
                try {
                    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })

                    if (!res.ok) throw new Error(`Request failed (${res.status})`)
                    const json = await res.json()

                    alert(`Thanks — message sent (id: ${json.id}).`)
                    form.reset()
                    form.classList.remove('was-validated')
                    Array.from(form.querySelectorAll('.is-valid, .is-invalid')).forEach(el => {
                        el.classList.remove('is-valid', 'is-invalid')
                    })
                    return
                } catch (err) {
                    console.error('Failed to post form data', err)
                    alert('Failed to send message — please try again later.')
                }
            }
            form.classList.add('was-validated')
        }, false)
    })

    // active nav link scrolling
    const sectionLinks = Array.from(document.querySelectorAll('a.nav-link[href^="#"]'))
    const sections = sectionLinks.map(a => document.querySelector(a.getAttribute('href')))
    const onScroll = () => {
        const pos = window.scrollY
        for (let i = sections.length - 1; i >= 0; i--) {
            const sec = sections[i]
            if (!sec) continue
            if (sec.offsetTop <= pos) {
                sectionLinks.forEach(item => item.classList.remove('active'))
                const selector = `a.nav-link[href="#${sec.id}"]`
                const link = document.querySelector(selector)
                if (link) link.classList.add('active')
                break
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
})()
