<script>
    export let code;

    import hljs from 'highlight.js/lib/core';
    import javascript from 'highlight.js/lib/languages/javascript';
    hljs.registerLanguage('javascript', javascript);
    
    let code_container, renameTimeout;

    const copy = (e) => {
        navigator.clipboard.writeText(code);
        if (!e) return;
        e.target.innerText = "Code copied!";
        if (renameTimeout) clearTimeout(renameTimeout);
        renameTimeout = setTimeout(
            () => (e.target.innerText = "Copy to clipboard"),
            2000
        );
    };

    const highlight = () => {
        if (!code_container) return;
        return (code_container.innerHTML = hljs.highlight(code, {
            language: "javascript",
        }).value);
    };

    $: code, highlight();
</script>

<div class="code">
    <button on:click={copy}>Copy to clipboard</button>
    <pre><code class="hljs" bind:this={code_container} /></pre>
</div>

<style>
    .hljs {
        overflow: initial;
    }

    .code button {
        position: absolute;
        top: 10px;
        cursor: pointer;
        right: 10px;
        font-size: 0.75rem;
        background: #4d5269;
        padding: 0.25rem 0.5rem;
        border: none;
        color: white;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    pre {
        margin: 0;
    }

    .code {
        position: relative;
        background: #282a36;
        padding: 0.75rem;
        overflow: auto;
    }

    .code button:hover {
        opacity: 1;
    }

    .code *,
    :global(code > *) {
        font-family: monospace !important;
    }
</style>
